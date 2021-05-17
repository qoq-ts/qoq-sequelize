import { Model } from './Model';
import { SequelizeHooks } from './SequelizeHooks';

/**
 * Virtual class for deduplication
 */
export class Hooks<
  M extends Model<TModelAttributes, TCreationAttributes> = Model,
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
> {
  /**
   * A dummy variable that doesn't exist on the real object. This exists so
   * Typescript can infer the type of the attributes in static functions. Don't
   * try to access this!
   */
  _model: M;
  /**
   * A similar dummy variable that doesn't exist on the real object. Do not
   * try to access this in real code.
   */
  _attributes: TModelAttributes;
  /**
   * A similar dummy variable that doesn't exist on the real object. Do not
   * try to access this in real code.
   */
  _creationAttributes: TCreationAttributes;

  /**
   * Add a hook to the model
   *
   * @param name Provide a name for the hook function. It can be used to remove the hook later or to order
   *   hooks based on some sort of priority system in the future.
   */
  public static addHook<
    H extends Hooks,
    K extends keyof SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>,
  >(
    this: HooksStatic<H>,
    hookType: K,
    name: string,
    fn: SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>[K],
  ): HooksCtor<H>;
  public static addHook<
    H extends Hooks,
    K extends keyof SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>,
  >(
    this: HooksStatic<H>,
    hookType: K,
    fn: SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>[K],
  ): HooksCtor<H>;

  /**
   * Remove hook from the model
   */
  public static removeHook<H extends Hooks>(
    this: HooksStatic<H>,
    hookType: keyof SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>,
    name: string,
  ): HooksCtor<H>;

  /**
   * Check whether the mode has any hooks of this type
   */
  public static hasHook<H extends Hooks>(
    this: HooksStatic<H>,
    hookType: keyof SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>,
  ): boolean;
  public static hasHooks<H extends Hooks>(
    this: HooksStatic<H>,
    hookType: keyof SequelizeHooks<H['_model'], H['_attributes'], H['_creationAttributes']>,
  ): boolean;

  /**
   * Add a hook to the model
   *
   * @param name Provide a name for the hook function. It can be used to remove the hook later or to order
   *   hooks based on some sort of priority system in the future.
   */
  public addHook<K extends keyof SequelizeHooks<M, TModelAttributes, TCreationAttributes>>(
    hookType: K,
    name: string,
    fn: SequelizeHooks<Model, TModelAttributes, TCreationAttributes>[K],
  ): this;
  public addHook<K extends keyof SequelizeHooks<M, TModelAttributes, TCreationAttributes>>(
    hookType: K,
    fn: SequelizeHooks<M, TModelAttributes, TCreationAttributes>[K],
  ): this;
  /**
   * Remove hook from the model
   */
  public removeHook<K extends keyof SequelizeHooks<M, TModelAttributes, TCreationAttributes>>(
    hookType: K,
    name: string,
  ): this;

  /**
   * Check whether the mode has any hooks of this type
   */
  public hasHook<K extends keyof SequelizeHooks<M, TModelAttributes, TCreationAttributes>>(
    hookType: K,
  ): boolean;
  public hasHooks<K extends keyof SequelizeHooks<M, TModelAttributes, TCreationAttributes>>(
    hookType: K,
  ): boolean;
}

export type HooksCtor<H extends Hooks> = typeof Hooks & { new (): H };

export type HooksStatic<H extends Hooks> = { new (): H };
