import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionController } from './controllers/session.controller';
import { SessionService } from './services/session.service';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { AdminStimulusSetController } from './controllers/admin/stimulus-set.controller';
import { StimulusSetService } from './services/stimulus-set.service';
import { AdminAuthController } from './controllers/admin/auth.controller';
import { AuthService } from './services/auth.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminSessionsController } from './controllers/admin/sessions.controller';
import { AdminSessionService } from './services/admin-session.service';
import { AdminExportController } from './controllers/admin/export.controller';
import { AdminExportService } from './services/admin-export.service';
import { AdminAggregationController } from './controllers/admin/aggregation.controller';
import { AdminAggregationService } from './services/admin-aggregation.service';
import { LoggingService } from './services/logging.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SpotifyService } from './services/spotify.service';
@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    SessionController,
    EventsController,
    AdminStimulusSetController,
    AdminAuthController,
    AdminSessionsController,
    AdminExportController,
    AdminAggregationController,
  ],
  providers: [
    AppService,
    SessionService,
    EventsService,
    StimulusSetService,
    AuthService,
    AdminAuthGuard,
    AdminSessionService,
    AdminExportService,
    AdminAggregationService,
    LoggingService,
    SpotifyService,
  ],
})
export class AppModule {}
