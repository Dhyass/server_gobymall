
import axios from "axios";

// ✅ Obtension de la position du client via ipapi
export async function getClientLocationFromIP() {
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
      //country_flag : response.data.location.country_flag
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null; // fallback
  }
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
/*
export async function geocodeAddress(address) {
  try {
    const query = `${address.address}, ${address.city}, ${address.country}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    } else {
      throw new Error("Impossible de géocoder cette adresse.");
    }
  } catch (err) {
    console.error("Erreur géocodage:", err.message);
    throw err;
  }
}*/

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

