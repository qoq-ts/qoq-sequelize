import { ConsoleSlotManager } from 'qoq';
import { ToolBar } from '../slot/ToolBar';
import { SequelizeSlot } from '../slot/SequelizeSlot';

export const consoleSlots = ConsoleSlotManager
  // @ts-expect-error
  .use(new SequelizeSlot(undefined).fromShared())
  .use(new ToolBar());
