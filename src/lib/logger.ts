import * as uuid from 'uuid/v4';
import { mongoConfig } from '../config';
import { ILog, Log } from '../mongo/models/log';

export class Logger {
  private logModel = new Log(mongoConfig);
  private groupId = uuid();
  private isGroup: boolean;

  constructor(isGroup: boolean = false) {
    this.isGroup = isGroup;
  }

  public async info(message: string, error?: Error) {
    const insertLog: ILog = {
      errorType: 'Info',
      message: `[Info]: ${message}`,
    };
    if (error) { insertLog.error = error; }
    await this.pushIntoMongo(insertLog);
  }

  public async warn(message: string, error?: Error) {
    const insertLog: ILog = {
      errorType: 'Warn',
      message: `[Warn]: ${message}`,
    };
    if (error) { insertLog.error = error; }
    await this.pushIntoMongo(insertLog);
  }

  public async error(message: string, error: Error) {
    const insertLog: ILog = {
      errorType: 'Error',
      message: `[Error]: ${message}`,
      error,
    };
    await this.pushIntoMongo(insertLog);
  }

  private async pushIntoMongo(log: ILog) {
    if (this.isGroup) { log.groupId = this.groupId; }
    log.createdBy = 'logger';
    await this.logModel.insertOne(log);
  }
}
