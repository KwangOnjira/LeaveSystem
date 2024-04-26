const fs = require('fs');

exports.signature = (req,res,next) =>{
    const { imageURL } = req.body;
    
    if (!imageURL) {
        return res.status(400).json({ error: 'imageURL is missing or undefined' });
    }
    const base64Data = imageURL.replace(/^data:image\/png;base64,/, "");
    req.signatureData = {
        base64Data,
        fileName: `signature_${Date.now()}.png`
    };
    
    next();
}