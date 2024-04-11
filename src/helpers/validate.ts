type Data = {
    [key: string]: any;
};

/* EXPORT: ModelString */
export type ModelString = {
    type: 'string';
    required?: boolean;
    null?: boolean;
    exceptions?: string[];
    options?: string[];
    empty?: boolean;
    mask?: RegExp;
};

/* EXPORT: ModelNumber */
export type ModelNumber = {
    type: 'number';
    required?: boolean;
    null?: boolean;
    exceptions?: number[];
    options?: number[];
    valueMin?: number;
    valueMax?: number;
};

/* EXPORT: ModelInteger */
export type ModelInteger = {
    type: 'integer';
    required?: boolean;
    null?: boolean;
    exceptions?: number[];
    options?: number[];
    valueMin?: number;
    valueMax?: number;
};

/* EXPORT: ModelArray */
export type ModelArray = {
    type: 'array';
    required?: boolean;
    null?: boolean;
    empty?: boolean;
};

/* EXPORT: ModelDictionary */
export type ModelDictionary = {
    type: 'dictionary';
    required?: boolean;
    null?: boolean;
    strict?: boolean;
    model: { [key: string]: Model };
};

type Model = ModelString | ModelNumber | ModelInteger | ModelArray | ModelDictionary;


const VALIDATORS: {
    'string': (value: string, model: ModelString) => boolean;
    'number': (value: number, model: ModelNumber) => boolean;
    'integer': (value: number, model: ModelInteger) => boolean;
    'array': (value: any[], model: ModelArray) => boolean;
    'dictionary': (value: { [key: string]: any }, model: ModelDictionary) => boolean;
} = {
    'string': (value, model: ModelString) => {
        if (model.null && value === null)
            return true;
        if (typeof value !== 'string')
            return false;
        if (!model.empty && !value)
            return false;
        if (model.mask)
            if (!model.mask.test(value))
                return false;
        if (model.exceptions)
            if (model.exceptions.indexOf(value) > -1)
                return false;
        if (model.options)
            if (model.options.indexOf(value) == -1)
                return false;	
        return true;				
    },
    'number': (value, model: ModelNumber) => {
        if (model.null && value === null)
            return true;
        if (typeof value !== 'number')
            return false;
        if (model.exceptions)
            if (model.exceptions.indexOf(value) > -1)
                return false;
        if (model.options)
            if (model.options.indexOf(value) == -1)
                return false;
        if (model.valueMin)
            if (value < model.valueMin)
                return false;
        if (model.valueMax)
            if (value > model.valueMax)
                return false;
        return true;
    },
    'integer': (value, model: ModelInteger) => {
        if (model.null && value === null)
            return true;
        if (typeof value !== 'number' || Math.floor(value) !== value)
            return false;
        if (model.exceptions)
            if (model.exceptions.indexOf(value) > -1)
                return false;
        if (model.options)
            if (model.options.indexOf(value) == -1)
                return false;
        if (model.valueMin)
            if (value < model.valueMin)
                return false;
        if (model.valueMax)
            if (value > model.valueMax)
                return false;
        return true;
    },
    'array': (value, model: ModelArray) => {
        if (model.null && value === null)
            return true;
        if (!Array.isArray(value))
            return false;
        if (!model.empty && !value.length)
            return false;
        return true;
    },
    'dictionary': (value, model: ModelDictionary) => {
        if (model.null && value === null)
            return true;
        if (typeof value !== 'object')
            return false;
        return true;
    },
};


/* EXPORT: validate */
export function validate(data: Data, model: { [key: string]: Model }, strict: boolean = false): boolean {
	const modelKeys = Object.keys(model);
	const mklen = modelKeys.length;
	if (strict) {
		const dataKeys = Object.keys(data);
		const dklen = dataKeys.length;
        if (mklen != dklen)
            return false;
		for (let i = 0; i < dklen; i++)
			if (!model.hasOwnProperty(dataKeys[i]))
				return false;
	}
	for (let i = 0; i < mklen; i++) {
		const attr: Model = model[modelKeys[i]];
		const check = data.hasOwnProperty(modelKeys[i]);
		if (check) {
			if (attr.type === 'dictionary') {
                let valid: boolean = VALIDATORS[attr.type](data[modelKeys[i]], attr);
                if (!valid)
					return false;
				valid = validate(data[modelKeys[i]], attr.model, attr.strict ? true : false);
				if (!valid)
					return false;
			}
			else if (attr.type === 'string') {
				let valid: boolean = VALIDATORS['string'](data[modelKeys[i]], attr);
				if (!valid)
					return false;
			}
            else if (attr.type === 'number') {
				let valid: boolean = VALIDATORS['number'](data[modelKeys[i]], attr);
				if (!valid)
					return false;
			}
            else if (attr.type === 'integer') {
				let valid: boolean = VALIDATORS['integer'](data[modelKeys[i]], attr);
				if (!valid)
					return false;
			}
            else if (attr.type === 'array') {
				let valid: boolean = VALIDATORS['array'](data[modelKeys[i]], attr);
				if (!valid)
					return false;
			}
		}
		else {
			if (attr.required)
				return false;
		}
	}
	return true;
}
