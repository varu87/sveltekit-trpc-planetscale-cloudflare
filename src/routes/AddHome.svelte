<script lang="ts">
  import { enhance, type SubmitFunction } from "$app/forms";
  import { page } from "$app/stores";
  import { UserHomeRoles } from "$lib/db/types";
  import { currentUser } from "$lib/store";

  let loading = false;
  let firstname = "";
  let lastname = "";
  let error = "";

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ result }) => {
      if (result.type === "failure") {
        const { data } = result;
        error = `${data?.error ?? ""}`;
      }
      if (result.type === "success") {
        currentUser.set({
          firstname: firstname,
          lastname: lastname,
          email: $page.data.session?.email!,
          homes: [
            {
              name: `${firstname}'s home`,
              role: UserHomeRoles.OWNER,
            },
          ],
        });
        loading = false;
      }
    };
  };
</script>

<section>
  <article>
    <form
      method="post"
      action="?/createUser"
      autocomplete="off"
      class:loading
      use:enhance={handleSubmit}
    >
      <header>Tell us about yourself</header>
      {#if error}
        <p>{error}</p>
      {/if}
      <div class="name">
        <div class="field">
          <label for="firstname">First Name</label>
          <input
            id="firstname"
            type="text"
            name="firstname"
            bind:value={firstname}
          />
        </div>
        <div class="field">
          <label for="lastname">Last Name</label>
          <input
            id="lastname"
            type="text"
            name="lastname"
            bind:value={lastname}
          />
        </div>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={$page.data.session?.email}
          readonly
        />
      </div>
      <div class="field">
        <label for="addressLine1">Address Line 1</label>
        <input id="addressLine1" type="text" name="addressLine1" />
      </div>
      <div class="field">
        <label for="addressLine2">Address Line 2</label>
        <input id="addressLine2" type="text" name="addressLine2" />
      </div>
      <div class="field">
        <label for="city">City</label>
        <input id="city" type="text" name="city" />
      </div>
      <div class="state">
        <div class="field">
          <label for="state">State</label>
          <input id="state" type="text" name="state" />
        </div>
        <div class="field">
          <label for="postCode">Post Code</label>
          <input id="postCode" type="text" name="postcode" />
        </div>
      </div>
      <div class="field">
        <label for="country">Country</label>
        <input id="country" type="text" name="country" />
      </div>
      <div class="actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  </article>
</section>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 35px 10px;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    margin-top: 30px;
    position: relative;
  }
  form.loading:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
  }
  header {
    display: flex;
    justify-content: center;
  }
  .field {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .name,
  .state {
    display: flex;
    gap: 10px;
  }
  .field label {
    margin-bottom: 7px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
  .field input {
    padding: 7px;
    outline: none;
  }
  .actions {
    display: flex;
    justify-content: space-between;
  }
  button {
    padding: 5px 7px;
    color: white;
    background: blue;
    font-weight: bold;
    letter-spacing: 1.5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
