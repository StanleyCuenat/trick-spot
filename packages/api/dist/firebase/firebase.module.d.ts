import { DynamicModule } from '@nestjs/common';
export declare class FirebaseModule {
    static forRoot(googleApplicationCredentialPath: string | undefined): DynamicModule;
}
