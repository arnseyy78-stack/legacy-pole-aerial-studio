// Keep your current full code, but replace the entire choosePackage(pkg) function with this:

async function choosePackage(pkg) {
  setLoading(true);
  setSelectedPackage(pkg);

  localStorage.setItem("legacyPackage", JSON.stringify(pkg));

  const savedStudent =
    JSON.parse(localStorage.getItem("legacyStudent")) || student;

  const studentEmail = savedStudent.email;

  if (pkg.name === "TEST PACKAGE") {
    const booking = {
      student: savedStudent,
      package: pkg,
      class: null,
      creditsRemaining: 5,
      creditType: pkg.type,
      purchaseDate: new Date().toLocaleDateString(),
      expiryDate: "No expiry"
    };

    localStorage.setItem(`legacyBooking_${studentEmail}`, JSON.stringify(booking));
    localStorage.setItem(`legacyCredits_${studentEmail}`, 5);

    setLoading(false);
    setPage("schedule");
    return;
  }

  if (pkg.name === "Practice Session") {
    const booking = {
      student: savedStudent,
      package: pkg,
      class: {
        day: "Practice Session",
        time: "Contact Studio",
        name: "Contact the studio for time schedule"
      },
      creditsRemaining: 1,
      creditType: pkg.type,
      purchaseDate: new Date().toLocaleDateString(),
      expiryDate: "Contact studio"
    };

    localStorage.setItem(`legacyBooking_${studentEmail}`, JSON.stringify(booking));
    localStorage.setItem(`legacyCredits_${studentEmail}`, 1);

    setLoading(false);
    setPage("dashboard");
    return;
  }

  if (pkg.name === "Class Card of 5") {
    localStorage.setItem(`legacyCredits_${studentEmail}`, 5);
  }

  try {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        packageName: pkg.name,
        amount: pkg.amount,
        studentName: savedStudent.fullName,
        studentEmail: savedStudent.email
      })
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      alert("Checkout failed.");
      setLoading(false);
    }
  } catch {
    alert("Checkout error.");
    setLoading(false);
  }
}
