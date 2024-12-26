import { EvilType } from "../evil-type.ts/common/evil-type";
export { EvilType };
export namespace Type
{
    export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules";
    export interface EvilTimerConfigType
    {
        $schema?: "https://raw.githubusercontent.com/wraith13/evil-timer.js/master/generated/schema.json#";
        disabled?: boolean;
        debug?: boolean;
        disabledLoadMessage?: boolean;
        date?: boolean | number | string;
        speed?: number;
        pause?: boolean;
        styleReplaceMode?: StyleReplaceModeType;
    }
    export const isStyleReplaceModeType: EvilType.Validator.IsType<StyleReplaceModeType> = EvilType.Validator.isEnum([ "auto", "disabled",
        "embedded", "rules" ] as const);
    export const isEvilTimerConfigType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(evilTimerConfigTypeValidatorObject, {
        additionalProperties: false }));
    export const evilTimerConfigTypeValidatorObject: EvilType.Validator.ObjectValidator<EvilTimerConfigType> = ({ $schema:
        EvilType.Validator.isOptional(EvilType.Validator.isJust(
        "https://raw.githubusercontent.com/wraith13/evil-timer.js/master/generated/schema.json#" as const)), disabled:
        EvilType.Validator.isOptional(EvilType.Validator.isBoolean), debug: EvilType.Validator.isOptional(EvilType.Validator.isBoolean),
        disabledLoadMessage: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), date: EvilType.Validator.isOptional(
        EvilType.Validator.isOr(EvilType.Validator.isBoolean, EvilType.Validator.isNumber, EvilType.Validator.isString)), speed:
        EvilType.Validator.isOptional(EvilType.Validator.isNumber), pause: EvilType.Validator.isOptional(EvilType.Validator.isBoolean),
        styleReplaceMode: EvilType.Validator.isOptional(isStyleReplaceModeType), });
}
