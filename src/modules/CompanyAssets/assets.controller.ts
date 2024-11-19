import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AssetsServices } from "./assets.service";
import { AssetsDataDto } from "./dtos/assets.dto";
import { validateObjectId } from "src/validators/id-validator.validator";
import { ReturnAssetsDataDto } from "./dtos/returnAssets.dto";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('api/assets')
export class AssetsController {
    constructor(private readonly AssetServices: AssetsServices) { }

    @Get('/return/:page?/:limit?/:search?')
    async allReutrnAssets(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.AssetServices.getAllReturnAssets(page, limit, search)
    }

    @Get('/:page?/:limit?/:search?')
    async allAssets(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.AssetServices.getAllAssets(page, limit, search)
    }

    @Post('/create')
    async create(@Body() assetdata: AssetsDataDto) {
        return this.AssetServices.assignAsset(assetdata)
    }

    @Patch('update/:assetid/:status?')
    async update(
        @Param('assetid') assetId: string,
        @Query('status') status: string) {
        validateObjectId(assetId, 'Asset ID')
        if (status !== 'assigned' && status !== 'returned' && status !== 'in_maintenance') {
            throw new BadRequestException('invalid status');
        }
        return this.AssetServices.updateAsset(assetId, status)
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        validateObjectId(id, 'Asset ID');
        return this.AssetServices.delete(id)
    }

    @Post('/return/create')
    async returnAssetCreate(@Body() returnAssetData: ReturnAssetsDataDto) {
        return this.AssetServices.createReturnAssetReq(returnAssetData)
    }

    @Patch('/return/update/:returnAssetid/:status?')
    async updateReturnAsset(
        @Param('returnAssetid') requestId: string,
        @Query('status') status: string) {
        validateObjectId(requestId, 'Return Asset ID')
        if (status !== 'approved' && status !== 'declined' && status !== 'completed') {
            throw new BadRequestException('invalid status');
        }
        return this.AssetServices.updateReturnAsset(requestId, status)
    }

    @Delete('/return/delete/:id')
    async deleteReturnAsset(@Param('id') id: string) {
        validateObjectId(id, 'Return Asset ID');
        return this.AssetServices.deleteReturnAsset(id)
    }
}