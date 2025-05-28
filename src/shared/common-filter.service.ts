import {HttpStatus, Injectable} from '@nestjs/common';
import {FilterOperator,  paginate, Paginated, PaginateQuery} from "nestjs-paginate";
import {PaginateConfig} from "nestjs-paginate/lib/paginate";
import { ResponseDataDTO } from 'src/shared/response.data.dto';
import {Repository} from "typeorm";
import { CRUDMessages } from 'src/shared/messages.enum';
import { FilterComparator, FilterSuffix } from 'nestjs-paginate/lib/filter';


@Injectable()
export class CommonFilterService {
    types = [
        {type:'numeric',value:[FilterOperator.EQ, FilterComparator.OR ,FilterSuffix.NOT,FilterOperator.NULL,FilterOperator.BTW,FilterOperator.GT,FilterOperator.GTE,FilterOperator.LTE,FilterOperator.LT,FilterOperator.IN]},
        {type:'integer',value:[FilterOperator.EQ, FilterComparator.OR, FilterSuffix.NOT,FilterOperator.NULL,FilterOperator.BTW,FilterOperator.GT,FilterOperator.GTE,FilterOperator.LTE,FilterOperator.LT,FilterOperator.IN]},
        {type:'bigint',value:[FilterOperator.EQ, FilterComparator.OR, FilterSuffix.NOT,FilterOperator.NULL,FilterOperator.BTW,FilterOperator.GT,FilterOperator.GTE,FilterOperator.LTE,FilterOperator.LT,FilterOperator.IN]},
        {type:'character varying', value:[FilterOperator.EQ, FilterComparator.OR, FilterOperator.ILIKE,FilterOperator.NULL,FilterSuffix.NOT,FilterOperator.IN]},
        {type:'text',value:[FilterOperator.EQ, FilterComparator.OR, FilterOperator.ILIKE,FilterOperator.NULL,FilterSuffix.NOT,FilterOperator.IN]},
        {type:'character',value:[FilterOperator.EQ, FilterComparator.OR, FilterOperator.ILIKE,FilterOperator.NULL,FilterSuffix.NOT,FilterOperator.IN]},
        {type:'date',value:[FilterOperator.EQ, FilterComparator.OR, FilterSuffix.NOT,FilterOperator.NULL,FilterOperator.BTW,FilterOperator.GT,FilterOperator.GTE,FilterOperator.LTE,FilterOperator.LT,FilterOperator.IN]},
        {type:'timestamp',value:[FilterOperator.EQ, FilterComparator.OR, FilterSuffix.NOT,FilterOperator.NULL,FilterOperator.BTW,FilterOperator.GT,FilterOperator.GTE,FilterOperator.LTE,FilterOperator.LT,FilterOperator.IN]}
    ];

    async callView<T>(query: PaginateQuery,config:PaginateConfig<T>,repository:Repository<any>):Promise<ResponseDataDTO<T>>  {
          let resultQuery:Paginated<T> | null = null;

        resultQuery = await paginate(query,repository,config);

        const totalItems = resultQuery.meta?.totalItems ?? 0;
        const status = totalItems > 0 ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        const message = totalItems > 0
        ? 'Datos obtenidos correctamente.'
        : 'No se encontraron registros.';

        return new ResponseDataDTO<T>(
            JSON.stringify(query),
            resultQuery.data.length,
            resultQuery.data,
            status,
            message,
            );
        }
        

        async paginateFilter<T>(query: PaginateQuery,repository:Repository<any>,qb:any, nameId:any):Promise<ResponseDataDTO<T>|any>  {
            let resultQuery:Paginated<T> | null = null;

            let columnsName:any[] = this.getColumnsName<T>(repository);
            let columnsNameStr:any[] = this.getSearchableColumns<T>(repository);
            let filterableColumns = this.getFilterableColumns<T>(repository);

            let config: PaginateConfig<any> = {
                sortableColumns: columnsName,
                //nullSort: 'last',
                searchableColumns: columnsNameStr,
                filterableColumns: filterableColumns,
                defaultSortBy: [[nameId, 'DESC'],],
                defaultLimit: query.limit ? query.limit : 10
            }
            try{


                if (qb) {
                     resultQuery = await paginate(query, qb, config) as unknown as Paginated<any>;
                } else {
                       resultQuery = await paginate(query, repository, config);
                }

                return (resultQuery.meta?.totalItems ?? 0) > 0
                    ? new ResponseDataDTO<T>(
                        JSON.stringify(query),
                        resultQuery.meta!.totalItems!,
                        resultQuery.data,
                        HttpStatus.OK,
                        CRUDMessages.GetSuccess,
                        )
                    : new ResponseDataDTO<T>(
                        JSON.stringify(query),
                        0,
                        [],
                        HttpStatus.BAD_REQUEST,
                        CRUDMessages.GetNotfound,
                        );
            }catch (error) {
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [error.message]
                }
            }
        }

        getColumnsName<T>(entity:Repository<any>):string[] {
            return entity.metadata.columns.map(column => column.propertyName);
        }
        getColumnsName2<T>(entity2:Repository<any>):string[] {
            return entity2.metadata.columns.map(column => `${entity2.metadata.relations[0].propertyName}.`+column.propertyName);
        }

        getSearchableColumns<T>(entity:Repository<any>) {
            let typesText = ['character varying','text','character'];
            return entity.metadata.columns.filter( column => typesText.includes(column.type as string) )
                .map( column => column.propertyName);
        }
        getSearchableColumns2<T>(entity2:Repository<any>) {
            let typesText = ['character varying','text','character'];
            return entity2.metadata.columns.filter( column => typesText.includes(column.type as string) )
                .map( column => `${entity2.metadata.relations[0].propertyName}.`+column.propertyName);
        }

        getFilterableColumns<T>(entity:Repository<any>) {
            let filterableColumns = {};
            entity.metadata.columns.forEach( column => {
                let hasFilters = this.types.find( item => item.type === column.type)
                filterableColumns[column.propertyName] = hasFilters ? hasFilters.value : []
            });
            return filterableColumns;
        }
        getFilterableColumns2<T>(entity2:Repository<any>) {
            let filterableColumns = {};
            entity2.metadata.columns.forEach( column => {
                let hasFilters = this.types.find( item => item.type === column.type)
                filterableColumns[`${entity2.metadata.relations[0].propertyName}.`+column.propertyName] = hasFilters ? hasFilters.value : []
            });
            return filterableColumns;
        }

        async setAllItem<T>(query: PaginateQuery,repository:Repository<any>) {
            if(query.limit === 0) {
                query.limit = await repository.count();
            }
        }

        parseNotNull(value:string){
            return value?value.length> 0?`${value}`:null:null
        }

        nvlN(a, b: number){
            const isNumber = n => (n === +n);
            return isNumber(a)?a:b;
        }

        nvlS(x: string, y:string){
            return this.parseNotNull(x)!=null?x:y;
        }
}