"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FirebaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const firebase_constant_1 = require("./firebase.constant");
function createFirebaseInstance(googleApplicationCredentialPath) {
    const app = admin.initializeApp({
        credential: googleApplicationCredentialPath
            ? admin.credential.cert(googleApplicationCredentialPath)
            : admin.credential.applicationDefault(),
    });
    return {
        firestore: app.firestore(),
        storage: app.storage(),
        auth: app.auth(),
    };
}
let FirebaseModule = FirebaseModule_1 = class FirebaseModule {
    static forRoot(googleApplicationCredentialPath) {
        const provider = {
            provide: firebase_constant_1.FirebaseConstants.FIREBASE_TOKEN,
            useValue: createFirebaseInstance(googleApplicationCredentialPath),
        };
        return {
            module: FirebaseModule_1,
            providers: [provider],
            exports: [provider],
        };
    }
};
FirebaseModule = FirebaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        providers: [],
    })
], FirebaseModule);
exports.FirebaseModule = FirebaseModule;
//# sourceMappingURL=firebase.module.js.map