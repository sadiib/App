const { version } = require('../package.json');

const pullRequestNumber = process.env.PULL_REQUEST_NUMBER;

const s3Bucket = {
    production: process.env.S3_BUCKET || 'expensify-cash',
    staging: process.env.S3_BUCKET || 'staging-expensify-cash',
    adhoc: process.env.S3_BUCKET || 'ad-hoc-expensify-cash',
};

const s3Path = {
    production: '/',
    staging: '/',
    adhoc: process.env.PULL_REQUEST_NUMBER ? `/desktop/${pullRequestNumber}/` : '/',
};

const macIcon = {
    production: './desktop/icon.png',
    staging: './desktop/icon-stg.png',
    adhoc: './desktop/icon-adhoc.png',
};

// Linux icon configuration
const linuxIcon = {
    production: './desktop/icon.png',
    staging: './desktop/icon-stg.png',
    adhoc: './desktop/icon-adhoc.png',
};

const isCorrectElectronEnv = ['production', 'staging', 'adhoc'].includes(process.env.ELECTRON_ENV);
if (!isCorrectElectronEnv) {
    throw new Error('Invalid ELECTRON_ENV!');
}

const getMacBundleIconName = () => {
    if (process.env.ELECTRON_ENV === 'adhoc') {
        return 'AppIcon-adhoc';
    }
    if (process.env.ELECTRON_ENV === 'development') {
        return 'AppIcon-dev';
    }
    return 'AppIcon';
};

module.exports = {
    appId: 'com.expensifyreactnative.chat',
    productName: 'New Expensify',
    extraMetadata: {
        version,
    },
    asarUnpack: ['**/node-mac-permissions/bin/**'],

    mac: {
        category: 'public.app-category.finance',
        icon: macIcon[process.env.ELECTRON_ENV],
        hardenedRuntime: true,
        entitlements: 'desktop/entitlements.mac.plist',
        entitlementsInherit: 'desktop/entitlements.mac.plist',
        type: 'distribution',
        target: [
            {
                target: 'default',
                arch: ['universal'],
            },
        ],
        x64ArchFiles: '**/node_modules/node-mac-permissions/bin/**',
        extendInfo: {
            CFBundleIconName: getMacBundleIconName(),
            NSLocationWhenInUseUsageDescription: 'This app uses location to help you track distance expenses.',
            NSLocationUsageDescription: 'This app uses location to help you track distance expenses.',
        },
    },

    dmg: {
        title: 'New Expensify',
        artifactName: 'NewExpensify.dmg',
        internetEnabled: true,
    },

    linux: {
        target: [
            {
                target: 'deb',
                arch: ['x64'],
            },
        ],
        icon: linuxIcon[process.env.ELECTRON_ENV],
        category: 'Finance',
        maintainer: 'Expensify <contact@expensify.com>',
        synopsis: 'Financial collaboration centered around chat',
        description: 'The official desktop app for New Expensify — manage receipts, reports, and expenses effortlessly.',
        artifactName: 'NewExpensify-${version}-${arch}.${ext}',
        executableName: 'new-expensify',
    },

    deb: {
        depends: [],
        compression: 'xz',
    },

    publish: null,

    files: ['dist', '!dist/www/{.well-known,favicon*}'],

    directories: {
        app: 'desktop',
        output: 'desktop-build',
    },

    protocols: {
        name: 'New Expensify',
        schemes: ['new-expensify'],
    },

    afterPack: 'desktop/dist/afterPack.js',
};
