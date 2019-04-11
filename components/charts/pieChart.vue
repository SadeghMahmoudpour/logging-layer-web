<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
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
