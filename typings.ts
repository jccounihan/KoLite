/*
Typescript definitions
*/

interface KnockoutStatic {
    DirtyFlag: KnockoutDirtyFlag;
}

interface KnockoutDirtyFlag {
    new(objectToTrack: any, isInitiallyDirty: boolean, hashFunction?: any): KnockoutDirtyFlagResult;
}

interface KnockoutDirtyFlagResult {
    (): KnockoutDirtyFlagInstance;
}

interface KnockoutDirtyFlagInstance {
    forceDirty: () => void;
    isDirty: KnockoutComputed<boolean>;
    reset: () => void;
    logState: () => void;
    displayDiff: () => void;
}
