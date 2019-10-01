
export class Settings {
    public static defaultUserSettings = {
        "ExitDelay": 3000,
        "ScreenTransitionDelay": 100,
        "EnemyAttackDelay": 700,
        "AfterAttackDelay": 1000,
        "ShipArrangement" : "random",
        "PlayerShips": {}
    }
    
    public static userSettings = {...Settings.defaultUserSettings}
}

