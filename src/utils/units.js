const STORAGE_KEY = 'volumeUnit';
const ML_PER_OZ = 29.5735;

// The user's chosen unit, 'ml' or 'oz'
export function getVolumeUnit() {

    try {
        return localStorage.getItem(STORAGE_KEY) === 'oz' ? 'oz' : 'ml';
    } catch {
        return 'ml';
    }
};

export function setVolumeUnit(unit) {

    try {
        localStorage.setItem(STORAGE_KEY, unit);
    } catch {}
};

// Volumes are always stored as whole ml
export function toMl(amount, unit) {
    return Math.round(unit === 'oz' ? amount * ML_PER_OZ : amount);
};

export function fromMl(ml, unit) {
    return unit === 'oz' ? Math.round((ml / ML_PER_OZ) * 10) / 10 : ml;
};

// A stored ml volume in the user's unit, e.g. "3 oz"
export function formatVolume(ml) {

    const unit = getVolumeUnit();

    return `${fromMl(ml, unit)} ${unit}`;
};
