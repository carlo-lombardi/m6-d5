export default function pdfTemplate(profile, experiences) {
  function mapExperiences() {
    return experiences.map((experience) => {
      return `<div class="py-2">
      <hr class="w-100" />
      <div class="d-flex">
        <div>
          <img src="${experience.image}" alt="" />
        </div>
        <div class="mx-3">
          <h5>${experience.role}</h5>
          <h6 class="fst-italic">Area: ${experience.area}</h6>
          <span>From 2020-11-12 to 2021-01-02</span>
        </div>
      </div>
    </div>`;
    });
  }
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
    <style>
    .d-flex, .flex {
      display: -webkit-box;
      display: -webkit-flex;
      -webkit-flex-wrap: wrap;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
    }
    </style>

    <title>Hello, world!</title>
  </head>
  <body>
    <div class="container text-center my-4 h-100">
      <div class="d-flex vh-100 py-3 w-100 flex">
        <div class="w-25 bg-dark p-3 d-flex flex-column flex justify-content-start align-items-center text-light">
          <img class="img-fluid w-75 my-2 rounded-2" src="https://www.placecage.com/360/360" alt="" />
          <h4 class="my-2">${profile.name} ${profile.surname}</h4>
          <hr class="w-100" />

          <h5 class="my-2 fw-bold">CONTACT INFO</h5>
          <p>${profile.email}</p>
          <p>${profile.area}</p>
          <hr class="w-100" />
          <h5 class="fw-bold">ABOUT ME</h5>
          <p class="fst-italic">
            ${profile.bio}
          </p>
        </div>
        <div class="w-75 bg-light d-flex flex flex-column px-5 py-3">
          <h2 class="fw-bold">Experiences</h2>
          <div class="py-2">
            ${mapExperiences()}
          </div>
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
