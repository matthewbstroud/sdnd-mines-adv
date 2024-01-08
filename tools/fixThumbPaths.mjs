import { promises as fs } from "fs";
const replacements = [
    ['"custom_tokens/', '"modules/sdnd-mines-adv/images/custom_tokens/'],
    ['"custom_icons/', '"modules/sdnd-mines-adv/images/custom_icons/'],
    ['"tiles/', '"modules/sdnd-mines-adv/images/tiles/'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/custom_tokens/', 'modules/sdnd-mines-adv/images/custom_tokens/'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/custom_icons/', 'modules/sdnd-mines-adv/images/custom_icons/'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/tiles/', 'modules/sdnd-mines-adv/images/tiles/'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/Puddle%20of%20Blood.D14.watermarked.2k.png', 'modules/sdnd-mines-adv/images/custom_tokens/Puddle%20of%20Blood.D14.watermarked.2k.png'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/SFX/', 'modules/sdnd-mines-adv/SFX/'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/nothic.png', 'modules/sdnd-mines-adv/images/custom_tokens/Mobs/nothic.png'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/modules/curse_of_strahd/Tokens/NPC/Goblin_Token.webp', 'modules/sdnd-mines-adv/images/custom_tokens/Mobs/Goblin_Token.webp'],
    ['https://assets.forge-vtt.com/634b24b96df3a5a10e8ccd71/maps/', 'modules/sdnd-mines-adv/images/maps/'],
    ['modules/dransky-lost-mines-maps/audio/', 'modules/lost-mines-by-dranskyv2/audio/'],
    ['modules/sdnd-mines-adv/images/custom_tokens/twig_blight.png', 'modules/sdnd-mines-adv/images/custom_tokens/Mobs/twig_blight.png'],
    ['modules/sdnd-mines-adv/images/custom_tokens/Puddle%20of%20Blood.D14.watermarked.2k.png', 'modules/sdnd-mines-adv/images/Puddle%20of%20Blood.D14.watermarked.2k.png']
];
const MODULE_ID = process.cwd();
const desiredThumbPath = `modules/${process.env.npm_package_name}/images/thumbs/`;
const basePath = "./src/packs";
const packs = await fs.readdir(basePath);
let fileModfied = false;
for (const pack of packs) {
    if (pack === ".gitattributes") continue;
    const fileFolder = basePath + '/' + pack;
    const files = await fs.readdir(fileFolder);
    for (const file of files) {
        const filePath = fileFolder + '/' + file;
        console.log("Fixing " + file);
        let fileObject = {};
        try {
            let filedata = await fs.readFile(filePath, { encoding: 'utf8' });
            for (let replacement of replacements) {
                filedata = filedata.replaceAll(replacement[0], replacement[1]);
            }
            fileObject = JSON.parse(filedata);

        } catch (err) {
            console.log(err);
            continue;
        }
        for (let scene of fileObject.scenes) {
            if (scene.thumb.startsWith(desiredThumbPath)){
                continue;
            }
            fileModfied = true;
            console.log(`Modifying scene '${scene.name}'...`);
            console.log(`   Old Path: '${scene.thumb}'`);
            let newPath = desiredThumbPath + scene.thumb.split('/').pop();
            console.log(`   New Path: '${newPath}'`);
            scene.thumb = newPath;
        }
        try {
            await fs.writeFile(filePath, JSON.stringify(fileObject, null, 2));
            console.log("Save successful.");
        }
        catch (err) {
            console.log(err);
        }
        //console.log(fileObject.scenes.map(s => ({ "thumb": s.thumb })));
    }

    

}
console.log("finished");