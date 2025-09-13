const crypto = require("crypto");
const fs = require("fs");
const path = require("path");


const decryptFile = (encryptedPath, password, iv) => {
  const algorithm = "aes-256-ctr";
  const key = crypto.createHash("sha256").update(password).digest();

  const normalizedEncryptedPath = path.normalize(encryptedPath);
  const decryptedPath = normalizedEncryptedPath.replace(".enc", ".dec");

  const input = fs.createReadStream(normalizedEncryptedPath);
  const output = fs.createWriteStream(decryptedPath);

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));

  return new Promise((resolve, reject) => {
    input
      .pipe(decipher)
      .pipe(output)
      .on("finish", () => resolve(decryptedPath)) // Return string path
      .on("error", (error) => {
        console.error("Decryption error:", error);
        reject(error);
      });
  });
};

const decryptFileHandler = async (file, filePassword) => {
  try {
    const { filePath, encryptionKeyHash, iv } = file;

    const providedKeyHash = crypto.createHash("sha256").update(filePassword).digest("hex");

    if (providedKeyHash !== encryptionKeyHash) {
      throw new Error("Incorrect password.");
    }

    const decryptedPath = await decryptFile(filePath, filePassword, iv);

    // **Rename file by removing ".dec" extension**
    const finalDecryptedPath = decryptedPath.replace(".dec", ""); 
    fs.renameSync(decryptedPath, finalDecryptedPath); 

    return finalDecryptedPath; // Return the renamed file
  } catch (error) {
    console.error("Decryption handler error:", error);
    throw new Error("An error occurred during file decryption.");
  }
};

module.exports = { decryptFileHandler };
