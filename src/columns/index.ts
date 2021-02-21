import { Int } from './Int';
import { ColumnVirtual } from './Virtual';
import { ColumnAlias } from './Alias';
import { SmallInt } from './SmallInt';
import { MediumInt } from './mediumInt';
import { TinyText } from './TinyText';
import { Text } from './Text';
import { MediumText } from './MediumText';
import { LongText } from './LongText';
import { Varchar } from './Varchar';
import { Char } from './Char';
import { TinyInt } from './TinyInt';
import { BigInt } from './BigInt';
import { Float } from './Float';
import { Double } from './Double';
import { Real } from './Real';
import { Decimal } from './Decimal';
import { Time } from './Time';
import { ColDate } from './Date';
import { DateTime } from './DateTime';
import { Boolean } from './Boolean';
import { Uuid } from './Uuid';
import { Enum } from './Enum';

class Static {
  get alias() {
    return new ColumnAlias();
  }

  get virtual() {
    return new ColumnVirtual();
  }

  get enum() {
    return new Enum();
  }

  get boolean() {
    return new Boolean();
  }

  get tinyInt() {
    return new TinyInt();
  }

  get smallInt() {
    return new SmallInt();
  }

  get int() {
    return new Int();
  }

  get mediumInt() {
    return new MediumInt();
  }

  get bigInt() {
    return new BigInt();
  }

  get float() {
    return new Float();
  }

  get double() {
    return new Double();
  }

  get real() {
    return new Real();
  }

  get decimal() {
    return new Decimal();
  }

  get tinyText() {
    return new TinyText();
  }

  get text() {
    return new Text();
  }

  get mediumText() {
    return new MediumText();
  }

  get longText() {
    return new LongText();
  }

  get varChar() {
    return new Varchar();
  }

  get char() {
    return new Char();
  }

  get time() {
    return new Time();
  }

  get date() {
    return new ColDate();
  }

  get dateTime() {
    return new DateTime();
  }

  get uuid() {
    return new Uuid();
  }
}

export const column = new Static();
