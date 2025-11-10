import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


export async function POST(request: NextRequest) {
  try {
    console.log("=== SIGNUP API ROUTE HIT ===");

    // Connect to database
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Signup attempt for:", email);

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User created successfully:", savedUser.email);
    
    //send verification email

    await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: any) {
    console.log("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
