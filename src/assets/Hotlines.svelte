<script lang="ts">
    export let alignBottom = false;
</script>

<div class="hotlines" style={alignBottom ? "bottom: 0;" : ""}>
    <h3>Here if you need them</h3>
    <p><a href="https://sites.google.com/mrpk.org/musd-wellness-center/home?pli=1">MUSD Wellness Center</a></p>
    <p>NAMI Ventura County <a href="tel:8055006264">805-500-6264</a></p>
    <p>Trevor Lifeline (LGBTQ+ youth) <a href="tel:8664887386">1-866-488-7386</a></p>
    <p>National Suicide Prevention Lifeline: <a href="tel:8002738255">1-800-273-8255</a> or<br /><a href="sms:8059902972?&body=HOME">text HOME to 741741</a></p>
    <p>CA Youth Crisis Hotline: <a href="tel:8008435200">1-800-843-5200</a></p>
    <p>For imminent danger, call 911</p>
</div>



<style>
    .hotlines {
        position: absolute;
        margin-bottom: 2em;
        width: 100%;
        text-align: center;
    }
    .hotlines h3 {
        font-size: 1.2em;
        margin: 0;
    }
    .hotlines p {
        margin: 0;
    }
</style>