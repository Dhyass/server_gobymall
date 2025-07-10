
import axios from "axios";

// ✅ Obtension de la position du client via ipapi
/*export async function getClientLocationFromIP() {
  try {
    const options = {
      method: "GET",
      url: "https://api.ipapi.com/check",
      params: { access_key: process.env.IPAPI_KEY }, 
    };

    const response = await axios.request(options);

   // console.log('response ', response)

    return {
      country: response.data.country_name,
      countryCode: response.data.country_code,
      city: response.data.city,
      lat: response.data.latitude,
      lon: response.data.longitude,
      country_flag : response.data.location.country_flag
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null; // fallback
  }
}
*/
/*
export async function getClientLocationFromIP(req) {
  try {
    const response = await axios.get(`https://ipinfo.io/json?token=${process.env.IPINFO_IO_TOKEN}`);
    const [lat, lon] = response.data.loc.split(",");
   // console.log("response", response)
    return {
      country: response.data.country,
      city: response.data.city,
      region: response.data.region,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null;
  }
}
*/

// 📦 Import pour Node classique

// ✅ On détecte si on est dans Vercel
const isVercel = process.env.VERCEL === "1";

// ✅ Fonction unique exportée
export async function getClientLocationFromIP(req) {
  try {
    if (isVercel) {
      // ✅ Cas Vercel : on utilise @vercel/edge
      const { ipAddress, geolocation } = await import("@vercel/edge");

      const ip = ipAddress(req) || "inconnue";
      const geo = geolocation(req);

      console.log("📡 [Vercel] IP détectée :", ip);
      console.log("🌍 [Vercel] Localisation :", geo);

      if (geo && geo.city && geo.country) {
        return {
          ip,
          country: geo.country,
          countryCode: geo.country_code || geo.country,
          city: geo.city,
          lat: geo.latitude,
          lon: geo.longitude
        };
      } else {
        console.warn("⚠️ [Vercel] Localisation introuvable, fallback.");
        return fallbackLocation(ip);
      }
    } else {
      // ✅ Cas Node classique (Render, VPS…)
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress ||
        "inconnue";

      const response = await axios.get(
        `https://ipinfo.io/${ip}/json?token=VOTRE_CLE_API`
      );

      console.log("📡 [Node] IP détectée :", ip);
      console.log("🌍 [Node] Localisation :", response.data);

      if (response.data.loc) {
        const [lat, lon] = response.data.loc.split(",");
        return {
          ip,
          country: response.data.country,
          countryCode: response.data.country,
          city: response.data.city,
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        };
      } else {
        console.warn("⚠️ [Node] Localisation introuvable, fallback.");
        return fallbackLocation(ip);
      }
    }
  } catch (err) {
    console.error("❌ Erreur géolocalisation :", err.message);
    return fallbackLocation("inconnue");
  }
}

// ✅ Fonction fallback : retourne une position par défaut
function fallbackLocation(ip) {
  console.warn("🔁 Fallback sur localisation par défaut");
  return {
    ip,
    country: "Togo",
    countryCode: "TG",
    city: "Lomé",
    lat: 6.1725,
    lon: 1.2314
  };
}




// ✅ Calcul dynamique des frais d’expédition
export async function calculateDynamicShipping(sellerLocation, clientLocation, product, quantity) {
  try {
    if (!sellerLocation?.lat || !sellerLocation?.lon) {
      console.warn("Position vendeur manquante.");
      return 0;
    }
    if (!clientLocation?.lat || !clientLocation?.lon) {
      console.warn("Position client manquante.");
      return 0;
    }

    // ✅ Calculer la distance avec OSRM
    const routeURL = `https://router.project-osrm.org/route/v1/driving/${sellerLocation.lon},${sellerLocation.lat};${clientLocation.lon},${clientLocation.lat}?overview=false`;
    const response = await axios.get(routeURL);

    const distanceKm = response.data.routes[0].distance / 1000; // mètres ➝ km

    // Exemple : 0.1$/km + 0.05$/kg par unité
    const baseRate = 0.1 * distanceKm;
    const weightRate = (product.weight || 1) * 0.05; // fallback poids = 1kg
    const totalFee = (baseRate + weightRate) * quantity; // ✅ Multiplier par quantité

    return Math.ceil(totalFee); // arrondi
  } catch (err) {
    console.error("Erreur dynamic shipping :", err.message);
    return 0; // fallback
  }
}


// ✅ Géocoder l’adresse pour obtenir lat/lon

export async function geocodeAddress(address) {
  try {
    // ✅ Créer une chaîne d’adresse propre
    const queryParts = [
      address.address || "",
      address.city || "",
      address.region || "",
      address.country || ""
    ].filter(Boolean); // supprimer les vides

    const query = queryParts.join(", ");
    console.log("Adresse à géocoder:", query);

    if (!query) throw new Error("Adresse invalide");

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: { "User-Agent": "Gobymall/1.0" }, // ⚠ Obligatoire pour Nominatim
      timeout: 5000 // ⏱ pour éviter les blocages
    });

    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    } else {
      console.warn("Nominatim n’a pas trouvé l’adresse:", query);

      // ✅ Fallback sur pays/city seulement
      if (address.country && address.city) {
        const fallbackQuery = `${address.city}, ${address.country}`;
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}`;
        const fallbackRes = await axios.get(fallbackUrl, {
          headers: { "User-Agent": "Gobymall/1.0" }
        });

        if (fallbackRes.data.length > 0) {
          return {
            lat: parseFloat(fallbackRes.data[0].lat),
            lon: parseFloat(fallbackRes.data[0].lon)
          };
        }
      }

      throw new Error("Impossible de géocoder cette adresse.");
    }
  } catch (err) {
    console.error("Erreur géocodage:", err.message);
    throw err;
  }
}

