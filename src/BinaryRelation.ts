// http://elib.spbstu.ru/dl/2/v17-1933.pdf/download/v17-1933.pdf

export class BinaryRelation {
    // массив входных полей (D)
    private arrayOfFields: Array<string> = [];
    // массив заголовков БО (BO) и параметров, отвечающих за то, как сравнивать (1 - побеждает
    // большее БО, -1 - побеждаем меньшее БО)
    private arrayOfBinaryRelationHeaders: Array<{ brName: string, compareParam: number }> = [];
    // массив входных данных (D / BO)
    private arrayOfInitialData: Array<Array<number>> = [];
    // массив массивов бинарных отношений (где индекс первого массива - индекс массива БО)
    private arrayOfBinaryRelationValues: Array<Array<Array<boolean>>> = [];

    public constructor(fields: Array<string>, binaryRelationHeaders: Array<{ brName: string, compareParam: number }>, initialData: Array<Array<number>>) {
        this.arrayOfFields = fields;
        this.arrayOfBinaryRelationHeaders = binaryRelationHeaders;
        this.arrayOfInitialData = initialData;
        
        // заполняем массив бинарных отношений
        this.arrayOfBinaryRelationValues = this.fillArrayOfBinaryRelationValues(this.arrayOfInitialData, this.arrayOfBinaryRelationHeaders, this.arrayOfFields.length);
        // печатаем на экран таблицы бинарных отношений
        this.printBinaryRelationValues(this.arrayOfFields, this.arrayOfBinaryRelationHeaders, this.arrayOfBinaryRelationValues);

        // console.log(this.blocking(this.arrayOfBinaryRelationValues));
        // console.log(this.dominant(this.arrayOfBinaryRelationValues));
        // console.log(this.tournament(this.arrayOfBinaryRelationValues, this.arrayOfFields.length))
    }

    /**
     * Метод заполняет массив бинарных отношений
     * @param initialData 
     * @param binaryRelationsHeaders
     * @param fieldsCount 
     */
    private fillArrayOfBinaryRelationValues(initialData: Array<Array<number>>, binaryRelationsHeaders: Array<{ brName: string, compareParam: number }>, fieldsCount: number): Array<Array<Array<boolean>>> {
        const localArrayOfBinaryRelationValues: Array<Array<Array<boolean>>> = [];

        binaryRelationsHeaders.forEach((binaryRelation, i) => {
            localArrayOfBinaryRelationValues.push([]);

            for (let j = 0; j < fieldsCount; j++) {
                localArrayOfBinaryRelationValues[i].push([]);
                // значение, с которым производим сравнение по столбцам
                const mainCompareValue = initialData[i][j];
 
                for (let k = 0; k < fieldsCount; k++) {
                    // проверка на то, что если (mainCompareValue - MAX + mainCompareValue - MIN) < 0 тогда при равности 2х БО обоим ставить false инчае обоим true
                    const binaryRelationWeight: number = (mainCompareValue - Math.max.apply(null, initialData[i])) + (mainCompareValue - Math.min.apply(null, initialData[i]));
                    const binaryRelationWeightResult: boolean = (binaryRelation.compareParam < 0) ? binaryRelationWeight < 0 : binaryRelationWeight > 0;
                    // производим сравнение параметров бинарного отношения
                    const currentBinaryRelation: boolean = (mainCompareValue != initialData[i][k]) 
                        ? (binaryRelation.compareParam < 0)
                            ? (mainCompareValue < initialData[i][k]) 
                            : (mainCompareValue > initialData[i][k])
                        :  binaryRelationWeightResult;
                    // добавляем значение бинарного отношения в массив бинарных отношений
                    localArrayOfBinaryRelationValues[i][j].push(currentBinaryRelation);
                }
            }
        });

        return localArrayOfBinaryRelationValues;
    }

    /**
     * Метод печатает на экран таблицы бинарных отношений
     * @param fields 
     * @param binaryRelationHeaders 
     * @param binaryRelationValues
     */
    private printBinaryRelationValues(fields: Array<string>, binaryRelationHeaders: Array<{ brName: string, compareParam: number }>, binaryRelationValues: Array<Array<Array<boolean>>>) {
        binaryRelationValues.forEach((binaryRelationTable, indexOfBinaryRelation) => {
            console.log(`\nТаблица бинарных отношений для параметра ${binaryRelationHeaders[indexOfBinaryRelation].brName}:`);

            console.log(`\t\t\t${fields.join('\t\t')}`);

            fields.forEach((fieldName, indexOfField) => {
                console.log(fieldName + '\t\t' + binaryRelationTable[indexOfField].join('\t\t\t'));
            })
        })
    }
}