/// <reference types='@dcloudio/types' />
import type { includeSrc } from '@/libs/utils';
import 'vue'

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance

  interface ComponentCustomOptions extends Hooks { }
}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks { };

  interface ComponentCustomProperties {
    include: typeof includeSrc,
  }
}
