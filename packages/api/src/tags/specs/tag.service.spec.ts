import { Test } from '@nestjs/testing';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TagModule } from '../tags.module';
import { INestApplication } from '@nestjs/common';
import { TagService } from '../tags.service';

describe('CREATE TAG', () => {
  let app: INestApplication;
  let tagService: TagService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        FirebaseModule.forRoot('./googleApplicationCredentials.json', {
          storageBucket: 'gs://trickspot-20ae3.appspot.com',
        }),
        TagModule,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    tagService = app.get<TagService>(TagService);
  });

  it('should create and return a valid TagDbDto', async () => {
    const dto = await tagService.createOrIncrement('testTag');
    expect(dto.toJson().id === 'testTag').toBeTruthy();
    expect(dto.toJson().totalPost === 1).toBeTruthy();
    const cleanDto = await tagService.decrementTag('testTag');
    expect(cleanDto.toJson().totalPost === 0).toBeTruthy();
  });
  it('should Update and return a valid TagDbDto', async () => {
    const dto = await tagService.createOrIncrement('testTag2');
    expect(dto.toJson().id === 'testTag2').toBeTruthy();
    expect(dto.toJson().totalPost === 1).toBeTruthy();
    const updatedDto = await tagService.createOrIncrement('testTag2');
    expect(updatedDto.toJson().id === 'testTag2').toBeTruthy();
    expect(updatedDto.toJson().totalPost === 2).toBeTruthy();
  });
  afterAll(async () => {
    await tagService.decrementTag('testTag');
    await tagService.decrementTag('testTag2');
    await tagService.decrementTag('testTag2');
  });
});
