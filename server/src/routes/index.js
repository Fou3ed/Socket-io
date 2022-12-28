import appRoutes from './appRoutes.js'
import {REST} from '../../index.js'
export default{
    /**
     * Create router
     */
    create(){
        const app= REST.getApp()
        /**
         * Create applications routes
         */
        app.use('/app',appRoutes)
    },
}