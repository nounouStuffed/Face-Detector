export const config = {
    debug: {
        tracking: {
            faceOverlay: true,
            landmarks: false,
            expressions: false,
        },
        metrics: true,
    },

    modules: {
        expressions: true,
    },

    tracking: {
        data: {
            inferPeriod: 80,
            maxMissing: 8,
            smoothing: 0.85,
            minConfidence: 0.3,
            reqConfidence: 0.7,
            minDetecConfidence: 0.17,
            model: "short",
        }
    }
}
