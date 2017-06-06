timestamp=`date +"%Y%m%d%H%M%S"`
version=`cat dist/version.json | grep "version" | sed 's/    "version": "//g' | sed 's/"//g'`

now:
	@echo $(timestamp)
	@echo $(version)

node_modules:
	@yarn cache clean
	@NODE_ENV=production yarn install

clean:
	@rm -rf dist

components: node_modules
	@node_modules/bower/bin/bower cache clean --allow-root
	@node_modules/bower/bin/bower install --allow-root

global: components clean
	@echo 'Packaging Global UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=global ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD//g app/version.json > dist/version.json
	ENV=global node_modules/.bin/includer -s conf -d dist -m @@TARGET:global_prd
	tar -vzcf vsf-ui-prd-global-$(version)-$(timestamp).tar.gz2 ./dist

india: components clean
	@echo 'Packaging India UI...'
	cp app/styles/_override.bootstrap.scss.in app/styles/_override.bootstrap.scss
	ENV=india ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD//g app/version.json > dist/version.json
	ENV=india node_modules/.bin/includer -s conf -d dist -m @@TARGET:in_prd
	tar -vzcf vsf-ui-prd-india-$(version)-$(timestamp).tar.gz2 ./dist

china: components clean
	@echo 'Packaging China UI...'
	cp app/styles/_override.bootstrap.scss.cn app/styles/_override.bootstrap.scss
	ENV=china ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD//g app/version.json > dist/version.json
	ENV=china node_modules/.bin/includer -s conf -d dist -m @@TARGET:cn_prd
	tar -vzcf vsf-ui-prd-china-$(version)-$(timestamp).tar.gz2 ./dist

china_uat: components clean
	@echo 'Packaging China UI...'
	cp app/styles/_override.bootstrap.scss.cn app/styles/_override.bootstrap.scss
	ENV=china_uat ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD/@`git rev-parse --short=9 HEAD`/g app/version.json > dist/version.json
	ENV=china_uat node_modules/.bin/includer -s conf -d dist -m @@TARGET:cn_uat
	tar -vzcf vsf-ui-uat-china-$(version)-$(timestamp).tar.gz2 ./dist

dev: components clean
	@echo 'Packaging Dev UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=dev ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD/@`git rev-parse --short=9 HEAD`/g app/version.json > dist/version.json
	ENV=dev node_modules/.bin/includer -s conf -d dist -m @@TARGET:global_dev
	tar -vzcf vsf-ui-dev-$(version)-$(timestamp).tar.gz2 ./dist

stg: components clean
	@echo 'Packaging Stg UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=stg ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD/@`git rev-parse --short=9 HEAD`/g app/version.json > dist/version.json
	ENV=stg node_modules/.bin/includer -s conf -d dist -m @@TARGET:global_stg
	tar -vzcf vsf-ui-stg-$(version)-$(timestamp).tar.gz2 ./dist

uat: components clean
	@echo 'Packaging Uat UI...'
	cp app/styles/_override.bootstrap.scss.global app/styles/_override.bootstrap.scss
	ENV=uat ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD/@`git rev-parse --short=9 HEAD`/g app/version.json > dist/version.json
	ENV=uat node_modules/.bin/includer -s conf -d dist -m @@TARGET:global_uat
	tar -vzcf vsf-ui-uat-$(version)-$(timestamp).tar.gz2 ./dist

india_uat: components clean
	@echo 'Packaging Uat India UI...'
	cp app/styles/_override.bootstrap.scss.in app/styles/_override.bootstrap.scss
	ENV=india_uat ./node_modules/gulp/bin/gulp.js recompile
	@sed -e s/@HEAD/@`git rev-parse --short=9 HEAD`/g app/version.json > dist/version.json
	ENV=india_uat node_modules/.bin/includer -s conf -d dist -m @@TARGET:in_uat
	tar -vzcf vsf-ui-uat-india-$(version)-$(timestamp).tar.gz2 ./dist

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
