const migrationPacks = [
    `sdnd-mines-adv.sdnd-mines-phandelver`
];

let utility = {
    "forceDnd5eMigration": async function _forceDnd5eMigration() {
        for (const packID of migrationPacks) {
            let pack = await game.packs.get(packID);
            await dnd5e.migrations.migrateCompendium(pack);
        }
        console.log("sdnd-strahd-adv compendium migration complete...");
    }
};

globalThis['sdndMines'] = {
	utility
}