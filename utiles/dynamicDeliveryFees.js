
import axios from "axios";
import { countries } from "country-data";
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

// ✅ Obtension de la position du client via ipinfo

 
 export async function getClientLocationFromIP(req) {
  try {
    // ✅ Étape 1: détecter l’IP client
    let ip =
      req.headers["x-forwarded-for"] || // Render/Vercel
      req.socket?.remoteAddress || // Local/dev
      req.connection?.remoteAddress ||
      null;

    // Si plusieurs IP (proxy), prendre la première
    if (ip && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Retirer préfixe IPv6 "::ffff:"
    if (ip && ip.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

   // console.log("Client IP détectée:", ip);

    // ✅ Étape 2: éviter localhost en dev
    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      console.warn("IP locale détectée, géolocalisation simulée");
      return {
        country: "TG", // Exemple : Togo
        city: "Lomé",
        region: "Maritime",
        lat: 6.1319,
        lon: 1.2228,
        currency: "XOF",
        language: "fr",
        country_flag :process.env.TOGO_FLAG,
      };
    }

    // ✅ Étape 3: appeler ipinfo.io pour l’IP publique
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_IO_TOKEN}`
    );

   // console.log('response', response)

    if (!response.data || !response.data.loc) {
      console.error("Réponse ipinfo invalide:", response.data);
      return null;
    }

    const [lat, lon] = response.data.loc.split(",");

    // ✅ Trouver la devise, langue, drapeau
    const countryInfo = countries[countryCode];
    const currency = countryInfo?.currencies?.[0] || "USD";
    const language = countryInfo?.languages?.[0] || "en";
    const flag = countryInfo?.emoji || "🏳️";


    return {
      ip,
      country: response.data.country,
      city: response.data.city,
      region: response.data.region,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      currency,
      language,
      country_flag :flag,
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null;
  }
}

/*
export async function getClientLocationFromIP(req) {
  try {
    // ✅ Récupérer IP et géolocalisation
    let ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress;
    if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
    if (ip?.startsWith("::ffff:")) ip = ip.substring(7);

    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      console.warn("IP locale détectée, géolocalisation simulée");
      return {
        country: "TG",
        city: "Lomé",
        region: "Maritime",
        lat: 6.1319,
        lon: 1.2228,
        currency: "XOF",
        language: "fr",
        country_flag :process.env.TOGO_FLAG,
      };
    }

    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_IO_TOKEN}`
    );

    if (!response.data || !response.data.loc) {
      console.error("Réponse ipinfo invalide:", response.data);
      return null;
    }

    const [lat, lon] = response.data.loc.split(",");
    const countryCode = response.data.country;

    // ✅ Trouver la devise, langue, drapeau
    const countryInfo = countries[countryCode];
    const currency = countryInfo?.currencies?.[0] || "USD";
    const language = countryInfo?.languages?.[0] || "en";
    const flag = countryInfo?.emoji || "🏳️";

    return {
      ip,
      country: countryCode,
      city: response.data.city,
      region: response.data.region,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      currency,
      language,
      country_flag :flag,
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null;
  }
}
*/
// 📦 Import pour Node classique
/*
import { geolocation, ipAddress } from "@vercel/edge";

const isVercel = process.env.VERCEL === "1";

export async function getClientLocationFromIP(req = null) {
  try {
    if (isVercel) {
      // ✅ Cas Vercel Edge Runtime
      const ip = req ? ipAddress(req) : "inconnue";
      const geo = req ? geolocation(req) : {};

      console.log("📡 [Vercel] IP détectée :", ip);
      console.log("🌍 [Vercel] Localisation :", geo);

      if (geo.city && geo.country) {
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
      if (!req || !req.headers) {
        console.warn("⚠️ Pas d'objet req valide, fallback.");
        return fallbackLocation("inconnue");
      }
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection?.remoteAddress ||
        "inconnue";

      const response = await axios.get(
        `https://ipinfo.io/${ip}/json?token=VOTRE_CLE_API`
      );

      console.log("📡 [Node] IP détectée :", ip);
      console.log("🌍 [Node] Localisation :", response.data);

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
    console.error("❌ Erreur géolocalisation :", err.message);
    return fallbackLocation("inconnue");
  }
}

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
*/
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

