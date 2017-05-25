timestamp=`date +"%Y%m%d%H%M%S"`
version=`cat app/version_prd.json | grep "version" | sed 's/[ a-zA-Z:"]//g'`

now:
	@echo $(timestamp)
	@echo $(version)

node_modules:
	@gem install sass
	@yarn cache clean
	@NODE_ENV=production yarn install

components: node_modules
	@node_modules/bower/bin/bower cache clean --allow-root
	@node_modules/bower/bin/bower install --allow-root

global: components
	@echo 'Packaging Global UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=global ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_prd dist/.htaccess
	cp app/version_prd.json dist/version.json
	tar -vzcf ssd-ui-prd-global-$(version)-$(timestamp).tar.gz2 ./dist

india: components
	@echo 'Packaging India UI...'
	cp app/styles/_override.bootstrap.scss.in app/styles/_override.bootstrap.scss
	ENV=india ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_prd_in dist/.htaccess
	cp app/version_prd.json dist/version.json
	tar -vzcf ssd-ui-prd-india-$(version)-$(timestamp).tar.gz2 ./dist

china: components
	@echo 'Packaging China UI...'
	cp app/styles/_override.bootstrap.scss.cn app/styles/_override.bootstrap.scss
	ENV=china ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_prd_cn_aliyun dist/.htaccess
	cp app/version_prd.json dist/version.json
	tar -vzcf ssd-ui-prd-china-$(version)-$(timestamp).tar.gz2 ./dist

china_qcloud: components
	@echo 'Packaging China QCloud UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=china_qcloud ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_prd_cn_qcloud dist/.htaccess
	cp app/version_prd.json dist/version.json
	tar -vzcf ssd-ui-prd-china-qcloud-$(version)-$(timestamp).tar.gz2 ./dist

china_uat: components
	@echo 'Packaging China UI...'
	cp app/styles/_override.bootstrap.scss.cn app/styles/_override.bootstrap.scss
	ENV=china_uat ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_uat_cn_aliyun dist/.htaccess
	tar -vzcf ssd-ui-uat-china-$(version)-$(timestamp).tar.gz2 ./dist

china_demo: components
	@echo 'Packaging China UI...'
	cp app/styles/_override.bootstrap.scss.cn app/styles/_override.bootstrap.scss
	ENV=china_demo node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_demo_cn_aliyun dist/.htaccess
	tar -vzcf ssd-ui-demo-china-$(version)-$(timestamp).tar.gz2 ./dist

dev: components
	@echo 'Packaging Dev UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=dev ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_dev dist/.htaccess
	tar -vzcf ssd-ui-dev-$(version)-$(timestamp).tar.gz2 ./dist

stg: components
	@echo 'Packaging Stg UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=stg ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_stg dist/.htaccess
	tar -vzcf ssd-ui-stg-$(version)-$(timestamp).tar.gz2 ./dist

uat: components
	@echo 'Packaging Uat UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=uat ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_uat dist/.htaccess
	tar -vzcf ssd-ui-uat-$(version)-$(timestamp).tar.gz2 ./dist

india_uat: components
	@echo 'Packaging Uat India UI...'
	cp app/styles/_override.bootstrap.scss.in app/styles/_override.bootstrap.scss
	ENV=india_uat ./node_modules/gulp/bin/gulp.js recompile
	cp app/.htaccess_uat_in dist/.htaccess
	tar -vzcf ssd-ui-uat-india-$(version)-$(timestamp).tar.gz2 ./dist

lift: components
	@echo 'Launch RD Develop Server'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	node_modules/gulp/bin/gulp.js lift

lift-dist: components
	@echo 'Launch RD Develop Server'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	node_modules/gulp/bin/gulp.js

update-remote:
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook aws.yml -i users.cfg -vvv
