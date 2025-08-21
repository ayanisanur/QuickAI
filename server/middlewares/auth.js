/**
👉 Clerk kimlik doğrulama servisini kullanarak
✅ Kullanıcının premium plana sahip olup olmadığını kontrol etmek
✅ Eğer premium değilse, kullanıcının ücretsiz kullanım hakkını (free_usage) kontrol etmek
✅ Bu bilgileri istek objesine (req) eklemek */

//Middleware to check userıd and hasPremiumPlan


// Clerk API’si ile kullanıcı bilgilerine erişmeni sağlar
import { clerkClient } from "@clerk/express";

export const auth= async(req,res,next)=>{
    try{
        const {userId, has}=await req.auth();
        const hasPremiumPlan =await has({plan: 'premium'});

        const user=await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage=user.privateMetadata.free_usage
        }else{
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage: 0

            }})
            req.free_usage=0;
        }
        req.plan=hasPremiumPlan ? 'premium' : 'free';
        next()
    }catch (error){
        res.json({success: false, message:error.message})

    }
}