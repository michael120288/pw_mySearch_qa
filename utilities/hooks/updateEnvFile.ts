const fs = require('fs');
const path = require('path');


/**
 * Updates specific keys in an environment-specific .env file.
 * @param {Object} updates - Key-value pairs to update in the .env file.
 * @param {string} env - The environment name (e.g., "qa", "prod").
 * @param {string} baseDir - Base directory where .env files are stored (default: current directory).
 */
export function updateEnvFile(updates: { [key: string]: string }, env: string, baseDir = path.resolve(__dirname, '../../env')) {
    const envFilePath = path.resolve(baseDir, `.env.${env}`);
    
    if (!fs.existsSync(envFilePath)) {
      throw new Error(`.env file for environment "${env}" not found at path: ${envFilePath}`);
    }
  
    //Read the existing .env file
    const envContent = fs.readFileSync(envFilePath, 'utf8');

    //Split into line and update values 
    const updateContent = envContent
    .split('\n')
    .map((line)=>{
        const [key, value] = line.split('=');
        if(updates[key] !== undefined){
            return `${key}=${updates[key]}`;
        }
        return line;
    })
    .join('\n');

    fs.writeFileSync(envFilePath, updateContent)
    console.log('Environment variables updated successfully');
}