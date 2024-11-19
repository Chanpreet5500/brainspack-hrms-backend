import { Controller, Get, Query, UseGuards, } from "@nestjs/common";
import { OffboardingServices } from "./offboarding.service";
import { AuthGuard } from "@nestjs/passport";


@UseGuards(AuthGuard('jwt'))
@Controller('api/offboarding')
export class OffboardingController {
    constructor(private readonly offboardingServices: OffboardingServices) { }

    @Get('/:page?/:limit?/:search?')
    async getOffboarding(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.offboardingServices.getAllOffboarding(page, limit, search)
    }

    // @Patch('/update/:id')
    // async update(id: string) {
    //     return this.offboardingServices.updateOffboarding(id)
    // }

}