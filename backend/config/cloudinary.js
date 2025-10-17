import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// This securely configures Cloudinary using your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    // Delete the temporary file from your server
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    // If the upload fails, delete the temporary file anyway
    fs.unlinkSync(localFilePath); 
    return null;
  }
};

export { uploadOnCloudinary };