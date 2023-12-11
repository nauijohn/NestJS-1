import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTravelerDetailsRequestDto } from './dtos/request/create-traveler-details-request.dto';
import { UpdateTravelerDetailsRequestDto } from './dtos/request/update-traveler-details-request.dto';
import { CreateTravelerDetailsResponseDto } from './dtos/response/create-traveler-details-response.dto';
import { DeleteTravelerDetailsResponseDto } from './dtos/response/delete-traveler-details-response.dto';
import { GetTravelerDetailResponseDto } from './dtos/response/get-traveler-detail-response.dto';
import { GetTravelerDetailsResponseDto } from './dtos/response/get-traveler-details-response.dto';
import { UpdateTravelerDetailsResponseDto } from './dtos/response/update-traveler-details-response.dto';
import { TravelerDetailsService } from './traveler-details.service';

@Controller()
@ApiTags('traveler-details')
export class TravelerDetailsController {
  constructor(
    private readonly travelerDetailsService: TravelerDetailsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('user')
  @ApiOperation({ summary: 'create new traveler details' })
  @ApiBody({ type: [CreateTravelerDetailsRequestDto] })
  @ApiOkResponse({
    status: 200,
    description: 'create traveler detail successful',
    type: CreateTravelerDetailsResponseDto,
  })
  async createUserTravelerDetails(
    @Body()
    createTravelerDetailsRequestDto: CreateTravelerDetailsRequestDto,
  ) {
    this.loggerService.log('createTravelerDetail...');
    const travelerDetail =
      await this.travelerDetailsService.createUserTravelerDetails(
        createTravelerDetailsRequestDto.data,
      );
    if (travelerDetail)
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully created traveler detail',
      };
  }

  @Get('user')
  @ApiOperation({ summary: 'fetches traveler details associated to user' })
  @ApiOkResponse({
    status: 200,
    description: 'successful fetch of user traveler details',
    type: GetTravelerDetailsResponseDto,
  })
  async fetchAllUserTravelerDetails(): Promise<GetTravelerDetailsResponseDto> {
    this.loggerService.log('fetchByUserId...');
    const travelerDetails =
      await this.travelerDetailsService.fetchAllUserTravelerDetails();
    return {
      statusCode: HttpStatus.OK,
      data: travelerDetails,
    };
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'fetches traveler detail by id' })
  @ApiOkResponse({
    status: 200,
    description: 'successful fetch of user traveler details',
    type: GetTravelerDetailResponseDto,
  })
  async fetchUserTravelerDetailById(
    @Param('id') id: string,
  ): Promise<GetTravelerDetailResponseDto> {
    this.loggerService.log('fetchById...');
    const travelerDetails =
      await this.travelerDetailsService.fetchUserTravelerDetailById(id);
    return {
      statusCode: HttpStatus.OK,
      data: travelerDetails,
    };
  }

  @Put('user')
  @ApiOperation({ summary: 'update traveler details' })
  @ApiBody({ type: [UpdateTravelerDetailsRequestDto] })
  @ApiOkResponse({
    status: 200,
    description: 'update traveler detail successful',
    type: UpdateTravelerDetailsResponseDto,
  })
  async updateUserTravelerDetails(
    @Body() updateTravelerDetailsRequestDto: UpdateTravelerDetailsRequestDto,
  ): Promise<UpdateTravelerDetailsResponseDto> {
    this.loggerService.log('updateById...');
    const result = await this.travelerDetailsService.updateUserTravelerDetails(
      updateTravelerDetailsRequestDto.data,
    );
    if (result)
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully updated traveler detail',
      };
  }

  @Delete('user/:id')
  @ApiOperation({ summary: 'delete traveler details by id' })
  @ApiOkResponse({
    status: 200,
    description: 'delete traveler detail successful',
    type: DeleteTravelerDetailsResponseDto,
  })
  async deleteUserTravelerDetailById(
    @Param('id') id: string,
  ): Promise<DeleteTravelerDetailsResponseDto> {
    const result =
      await this.travelerDetailsService.deleteUserTravelerDetailById(id);
    if (result)
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted traveler detail',
      };
  }
}
