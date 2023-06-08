"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectFirebaseAdmin = void 0;
const common_1 = require("@nestjs/common");
const firebase_constant_1 = require("./firebase.constant");
function InjectFirebaseAdmin() {
    return (0, common_1.Inject)(firebase_constant_1.FirebaseConstants.FIREBASE_TOKEN);
}
exports.InjectFirebaseAdmin = InjectFirebaseAdmin;
//# sourceMappingURL=firebase.decorator.js.map