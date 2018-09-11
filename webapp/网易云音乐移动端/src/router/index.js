import Vue from 'vue'
import Router from 'vue-router'
import Find from '@/components/Find'
import Me from '@/components/Me'
import Dynamic from '@/components/Dynamic'
import DetailPlaylist from '@/components/DetailPlaylist'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Find',
			component:Find
		},
		{
			path:"/Me",
			name:"Me",
			component:Me
		},
		{
			path:"/Dynamic",
			name:"Dynamic",
			component:Dynamic
		},
		{
			path:"/DetailPlaylist",
			name:"DetailPlaylist",
			component:DetailPlaylist
		}
	]
})
