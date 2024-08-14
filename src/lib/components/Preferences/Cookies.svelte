<script lang="ts">
	import type { userPreferences } from '@prisma/client';
  import Button from '$lib/components/ui/Button/Button.svelte';

	const {
		onsave,
		onreset,
		values
	}: {
		onsave?: () => void;
		onreset?: () => void;
		values: userPreferences | null;
	} = $props();
</script>

<h1 class="text-center text-5xl mb-2">Cookies</h1>
<p class="text-base text-center max-w-3xl mx-auto mb-5">
	In order to get full information from djinni and dou, you need to provide your cookies for this
	services. That is completely your own choise , our service will work without this cookies, but you
	will not get full information.
</p>
<div class="flex flex-col w-full border-b-4 border-neutral pb-10 mb-10 gap-5">
  <label class="input max-w-3xl mx-auto input-bordered flex items-center gap-2">
    Djinni Session Cookie
    <input type="password" class="grow" placeholder="Set cookie value" />
    <span
      class="badge {values
        ? values.djinniSessionCookie
          ? 'badge-success'
          : 'badge-warning'
        : 'badge-error'}">{values?.djinniSessionCookie ? 'Value is set' : 'No value'}</span
    >
  </label>
  <label class="input max-w-3xl mx-auto input-bordered flex items-center gap-2">
    Dou Session Cookie
    <input type="password" class="grow" placeholder="Set cookie value" />
    <span
      class="badge {values
        ? values.douSessionCookie
          ? 'badge-success'
          : 'badge-warning'
        : 'badge-error'}">{values?.douSessionCookie ? 'Value is set' : 'No value'}</span
    >
  </label>

  <Button extraClasses="max-w-3xl mx-auto" type="primary">Save</Button>
</div>
