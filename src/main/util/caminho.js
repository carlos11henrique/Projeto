import { app } from 'electron';
import path from 'path'

export const DEST_USER = app.getPath('userData')
export const DEST_DB =  path.join(DEST_USER, 'db.sqlite')