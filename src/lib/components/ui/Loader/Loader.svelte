<script lang="ts">
	const {
		type,
		size,
		color
	}: {
		type: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
		size: 'xs' | 'sm' | 'md' | 'lg';
		color:
			| 'primary'
			| 'secondary'
			| 'accent'
			| 'neutral'
			| 'info'
			| 'success'
			| 'warning'
			| 'error';
	} = $props();

  const spinnerTypes = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    ring: 'loading-ring',
    ball: 'loading-ball',
    bars: 'loading-bars',
    infinity: 'loading-infinity'
  };

  const spinnerSizes = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  const spinnerColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    neutral: 'text-neutral',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  };

</script>

<span class="loading {spinnerTypes[type]} {spinnerColors[color]} {spinnerSizes[size]}"></span>
