export default function pdfTemplate(profile, experiences) {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0"
      crossorigin="anonymous"
    />

    <title>Hello, world!</title>
  </head>
  <body>
    <div class="container text-center my-4 h-100">
      <div class="d-flex vh-100 py-3">
        <div class="w-25 bg-dark p-3 d-flex flex-column justify-content-start align-items-center text-light">
          <img class="img-fluid w-75 my-2 rounded-2" src="https://www.placecage.com/360/360" alt="" />
          <h4 class="my-2">Nicholas Cage</h4>
          <hr class="w-100" />

          <h5 class="my-2 fw-bold">CONTACT INFO</h5>
          <p>slavkoj6@gmail.com</p>
          <p>Croatia</p>
          <hr class="w-100" />
          <h5 class="fw-bold">ABOUT ME</h5>
          <p class="fst-italic">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam provident suscipit sapiente, dignissimos atque vel excepturi laborum placeat
            ipsum id.
          </p>
        </div>
        <div class="w-75 bg-light d-flex flex-column text-start px-5 py-3">
          <h2 class="">Experiences</h2>
        </div>
      </div>
    </div>

    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8"
      crossorigin="anonymous"
    ></script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.min.js" integrity="sha384-lpyLfhYuitXl2zRZ5Bn2fqnhNAKOAaM/0Kr9laMspuaMiZfGmfwRNFh8HlMy49eQ" crossorigin="anonymous"></script>
    -->
  </body>
</html>


    `;
}
