/*export const responseReturn=(res,code,data)=>{
    return res.status(code).json(data)
}
*/
export const responseReturn = (res, code, meta = {}, data = null) => {
    const isSuccess = code >= 200 && code < 300;

    // Structure standardisée de la réponse
    return res.status(code).json({
        success: isSuccess,
        statusCode: code,
        message: meta.message || (isSuccess ? "Request successful" : "An error occurred"),
        ...meta, // Ajout des métadonnées supplémentaires
        data: data || null, // Inclusion des données ou `null` si non défini
    });
};
