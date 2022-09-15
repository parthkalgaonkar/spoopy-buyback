<template>
	<div class="grid grid-cols-3 content-center justify-items-center">
		<div class="justify-center">
			{{off_text}}
		</div>
		<input type="checkbox" class="hidden" id="toggle" @click="toggleClick">
		<label for="toggle" 
			class="grid grid-cols-2 items-center relative
							before:h-[1em] before:w-[2em] before:border-[0.1em] before:border-srcwhite before:rounded-full before:grid before:col-span-2
							after:h-[0.7em] after:w-[0.7em] after:bg-srcwhite after:absolute after:rounded-full after:left-[0.15em] after:duration-200"
			:class="{
				'after:translate-x-[1em]' : checked
			}"></label>
		<div>
			{{on_text}}
		</div>
	</div>
</template>

<script>
	export default {
		props: ["off_text", "on_text"],
		emits: ["toggle"],
		data() {
			return {
				checked: false
			};
		},
		methods: {
			toggleClick() {
				this.checked = !this.checked;
				this.$emit('toggle', this.checked);
			}
		}
	}
</script>
