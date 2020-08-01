function clamp(min, max, value) {//clamps value to not be lower than min or higher than max
    return Math.max(min, Math.min(max, value));
}