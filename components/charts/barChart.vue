<script>
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  props: {
    options: Object,
    data: Object
  },
  watch: {
    data: function() {
      this.renderChart(this.data, this.options)
    }
  },
  mounted() {
    this.renderChart(this.data, this.options)
  }
}
</script>
