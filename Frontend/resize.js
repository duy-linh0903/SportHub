const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function resizeIcons() {
    const srcPath = 'C:/Users/Tung/.gemini/antigravity-ide/brain/667e45e4-c70a-40b5-bbb5-b2b931380df1/sporthub_app_icon_1786624479290.jpg';
    const baseDest = 'c:/CSW430/SportHub/Frontend/android/app/src/main/res';
    
    // We will install jimp temporarily just to run this script.
    try {
        console.log("Installing jimp...");
        execSync('npm install jimp@0.16.1 --no-save', { stdio: 'inherit' });
        const jimp = require('jimp');
        
        const sizes = {
            'mipmap-mdpi': 48,
            'mipmap-hdpi': 72,
            'mipmap-xhdpi': 96,
            'mipmap-xxhdpi': 144,
            'mipmap-xxxhdpi': 192
        };
        
        console.log("Reading image...");
        const image = await jimp.read(srcPath);
        
        for (const [folder, size] of Object.entries(sizes)) {
            const destDir = path.join(baseDest, folder);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            const destPath1 = path.join(destDir, 'ic_launcher.png');
            const destPath2 = path.join(destDir, 'ic_launcher_round.png');
            
            console.log(`Resizing to ${size}x${size} for ${folder}...`);
            const resized = image.clone().resize(size, size);
            
            await resized.writeAsync(destPath1);
            await resized.writeAsync(destPath2);
        }
        
        console.log("Done resizng Android icons!");
        
        // Let's also do iOS if we can.
        const iosBaseDest = 'c:/CSW430/SportHub/Frontend/ios/Frontend/Images.xcassets/AppIcon.appiconset';
        if (fs.existsSync(iosBaseDest)) {
            const iosSizes = {
                'Icon-App-20x20@1x.png': 20,
                'Icon-App-20x20@2x.png': 40,
                'Icon-App-20x20@3x.png': 60,
                'Icon-App-29x29@1x.png': 29,
                'Icon-App-29x29@2x.png': 58,
                'Icon-App-29x29@3x.png': 87,
                'Icon-App-40x40@1x.png': 40,
                'Icon-App-40x40@2x.png': 80,
                'Icon-App-40x40@3x.png': 120,
                'Icon-App-60x60@2x.png': 120,
                'Icon-App-60x60@3x.png': 180,
                'Icon-App-76x76@1x.png': 76,
                'Icon-App-76x76@2x.png': 152,
                'Icon-App-83.5x83.5@2x.png': 167,
                'Icon-App-1024x1024@1x.png': 1024
            };
            
            for (const [filename, size] of Object.entries(iosSizes)) {
                console.log(`Resizing to ${size}x${size} for iOS ${filename}...`);
                const resized = image.clone().resize(size, size);
                await resized.writeAsync(path.join(iosBaseDest, filename));
            }
            console.log("Done resizing iOS icons!");
        }

    } catch (e) {
        console.error(e);
    }
}

resizeIcons();
