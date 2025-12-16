import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EDependencyTokens } from 'src/enums/dependency-tokens.enum';

export const databaseProvider = {
    inject: [ConfigService],
    provide: EDependencyTokens.DB_CONNECTION_TOKEN,
    useFactory: async (configService: ConfigService) => {
        let reconnectionTask: NodeJS.Timeout | undefined;
        const RECONNECT_INTERVAL = 6000;

        // Connect to the database
        function connection() {
            const dbUri = configService.getOrThrow<string>('DB_URI');
            return mongoose.connect(dbUri, {});
        }

        mongoose.connection.on('connecting', () => {
            console.log('Database connection...');
        });

        mongoose.connection.on('open', () => {
            console.info('Database connection is successful！');
            clearTimeout(reconnectionTask);
            reconnectionTask = undefined;
        });

        mongoose.connection.on('disconnected', () => {
            console.error(
                `Database connection lost！try ${RECONNECT_INTERVAL / 1000}s Reconnect`,
            );
            reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
        });

        mongoose.connection.on('error', (error) => {
            console.error('Database exception！', error);
            mongoose.disconnect();
        });

        return await connection();
    },
};
