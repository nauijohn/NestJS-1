import { v4 as uuidv4 } from 'uuid';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { TboHotelPrebookResponsesService } from '../../providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-responses.service';
import { UpdateTransactionHotelRequestDto } from '../../transactions/hotels/dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotelsService } from '../../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePrebookingHotelRequestDto } from './dtos/request/create-prebooking-hotel-request.dto';
import { UpdatePrebookingHotelRequestDto } from './dtos/request/update-prebooking-hotel-request.dto';
import { HotelProvider } from './hotel-provider.enum';
import { PrebookingHotel } from './prebooking-hotel.entity';
import { PrebookingHotelsRepository } from './prebooking-hotels.repository';

@Injectable()
export class PrebookingHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionHotelsService: TransactionHotelsService,
    private readonly prebookingHotelsRepository: PrebookingHotelsRepository,
    private readonly tboHotelPrebookResponsesService: TboHotelPrebookResponsesService,
  ) {}

  async create(
    createPrebookingHotelRequestDto: CreatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('create...');

    console.log('this.request.user: ', this.request.user);

    const { provider, providerDetails, quantity, transactionId } =
      createPrebookingHotelRequestDto;

    const transactionHotelDB =
      await this.transactionHotelsService.fetchByTransactionId(transactionId);
    if (transactionHotelDB.prebookingHotel)
      this.errorHandlerService.internalServerErrorException(
        'TransactionHotel already pre-booked!',
      );

    const prebookingHotel = this.classMapper.map(
      createPrebookingHotelRequestDto,
      CreatePrebookingHotelRequestDto,
      PrebookingHotel,
    );
    prebookingHotel.userId = this.request.user?.id ?? null;
    prebookingHotel.providerReference = uuidv4();

    const newPrebookingHotel = await this.prebookingHotelsRepository.create(
      prebookingHotel,
    );

    const updateTransactionHotelRequestDto: UpdateTransactionHotelRequestDto = {
      id: transactionHotelDB.id,
      prebookingHotel: newPrebookingHotel,
    };

    if (provider === HotelProvider.Tbo) {
      const tboHotelPrebookResponses = await Promise.all(
        providerDetails.map((providerDetail) =>
          this.tboHotelPrebookResponsesService.create(providerDetail),
        ),
      );
      updateTransactionHotelRequestDto.prebookingHotel.tboHotelPrebookResponses =
        tboHotelPrebookResponses;
    }

    const updatedTransactionHotel = await this.transactionHotelsService.update(
      updateTransactionHotelRequestDto,
    );
    this.loggerService.debug(
      'updatedTransactionHotel: ',
      updatedTransactionHotel,
    );

    return newPrebookingHotel;
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.prebookingHotelsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const tboHotelPrebookResponse =
      await this.prebookingHotelsRepository.fetchById(id);
    if (!tboHotelPrebookResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return tboHotelPrebookResponse;
  }

  async update(
    updatePrebookingHotelRequestDto: UpdatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updatePrebookingHotelRequestDto;
    const tboHotelPrebookResponseDB =
      await this.prebookingHotelsRepository.fetchById(id);
    if (!tboHotelPrebookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const prebookingHotel = this.classMapper.map(
      updatePrebookingHotelRequestDto,
      UpdatePrebookingHotelRequestDto,
      PrebookingHotel,
    );

    return await this.prebookingHotelsRepository.update(prebookingHotel);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const tboHotelPrebookResponseDB =
      await this.prebookingHotelsRepository.fetchById(id);
    if (!tboHotelPrebookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.prebookingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
