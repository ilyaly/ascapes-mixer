<script>
  import CatalogNew from "./CatalogNew.svelte"
  
  let { label } = $props();
</script>


<div class="catalogs-header">
  <div class="label">{label}</div>
  <CatalogNew />
</div>


<style>

  .catalogs-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .label {
    font-size: 24px;
    font-weight: 500;
    margin: 8px;
  }
</style>
