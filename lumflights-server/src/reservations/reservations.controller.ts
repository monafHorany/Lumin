import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly firebaseService: FirebaseService,
  ) { }

  @Get('paginate')
  async paginateReservations(
    @Query('pageSize') pageSize: number,
    @Query('lastDocId') lastDocId?: string,
  ) {
    const pageSizeNum = Number(pageSize) || 10; // Default 10 if not provided
    return this.firebaseService.paginateCollection('reservations', pageSizeNum, lastDocId);
  }

  @Get()
  getReservations(@Query('role') role: string) {
    return this.reservationsService.getReservations(role);
  }

  @Get(':id')
  getReservationById(@Param('id') id: string) {
    return this.reservationsService.getReservationById(Number(id));
  }

  @Post(':collection')
  async create(
    @Param('collection') collection: string,
    @Body() data: Record<string, any>,
  ) {
    console.log('caled');
    return this.firebaseService.addDocument(collection, data);
  }

  @Get(':collection/:id')
  async read(@Param('collection') collection: string, @Param('id') id: string) {
    return this.firebaseService.getDocument(collection, id);
  }

  @Patch(':collection/:id')
  async update(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ) {
    return this.firebaseService.updateDocument(collection, id, data);
  }

  @Delete(':collection/:id')
  async delete(
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    return this.firebaseService.deleteDocument(collection, id);
  }


}
